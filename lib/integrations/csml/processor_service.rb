class Integrations::Csml::ProcessorService
  pattr_initialize [:event_name!, :hook!, :event_data!]

  def perform
    message = event_data[:message]

    return if message.private?
    return unless processable_message?(message)
    return unless conversation.pending?

    content = message_content(message)
    response = get_csml_response(conversation.contact_inbox.source_id, content) if content.present?
    process_response(message, response) if response.present?
  end

  private

  def csml_bot
    @csml_bot ||= CsmlBot.find(hook.settings['csml_bot_id'])
  end

  def conversation
    message = event_data[:message]
    @conversation ||= message.conversation
  end

  def message_content(message)
    # TODO: might needs to change this to a way that we fetch the updated value from event data instead
    # cause the message.updated event could be that that the message was deleted

    return message.content_attributes['submitted_values']&.first&.dig('value') if event_name == 'message.updated'

    message.content
  end

  def processable_message?(message)
    # TODO: change from reportable and create a dedicated method for this?
    return unless message.reportable?
    return if message.outgoing? && !processable_outgoing_message?(message)

    true
  end

  def processable_outgoing_message?(message)
    event_name == 'message.updated' && ['input_select'].include?(message.content_type)
  end

  def get_csml_response(_session_id, _content)
    @csml_engine = CsmlEngine.new(GlobalConfigService.load('CSML_BOT_HOST', ''), GlobalConfigService.load('CSML_BOT_API_KEY', ''))

    @csml_engine.run(
      bot_payload,
      client: client_params,
      payload: message_payload,
      metadata: metadata_params
    )
  end

  def client_params
    {
      bot_id: "chatwoot-bot-#{conversation.inbox.id}",
      channel_id: "chatwoot-bot-inbox-#{conversation.inbox.id}",
      user_id: session_id
    }
  end

  def message_payload
    {
      content_type: 'text',
      content: { text: content }
    }
  end

  def metadata_params
    {
      conversation: conversation,
      contact: conversation.contact
    }
  end

  def bot_payload
    {
      id: "chatwoot-csml-bot-#{csml_bot.id}",
      name: "chatwoot-csml-bot-#{csml_bot.id}",
      default_flow: 'chatwoot_bot_flow',
      flows: [
        {
          id: "chatwoot-csml-bot-flow-#{csml_bot.id}-inbox-#{conversation.inbox.id}",
          name: 'chatwoot_bot_flow',
          content: csml_bot.bot_config,
          commands: []
        }
      ]
    }
  end

  def process_response(message, response)
    csml_messages = response['messages']
    has_conversation_ended = response['conversation_end']

    process_action(message, 'handoff') if has_conversation_ended.present?

    return if csml_messages.blank?

    # We do not support wait, typing now.
    csml_messages.each do |csml_message|
      create_messages(csml_message, conversation)
    end
  end

  def create_messages(message, conversation)
    message_payload = message['payload']

    case message_payload['content_type']
    when 'text'
      process_text_messages(message, conversation)
    when 'question'
      process_question_messages(message, conversation)
    end
  end

  def process_text_messages(_message, conversation)
    conversation.messages.create(
      {
        message_type: :outgoing,
        account_id: conversation.account_id,
        inbox_id: conversation.inbox_id,
        content: message_payload['content']['text']
      }
    )
  end

  def process_question_messages(_message, conversation)
    buttons = message_payload['content']['buttons'].map do |button|
      { title: button['content']['title'], value: button['content']['payload'] }
    end
    conversation.messages.create(
      {
        message_type: :outgoing,
        account_id: conversation.account_id,
        inbox_id: conversation.inbox_id,
        content: message_payload['content']['title'],
        content_type: 'input_select',
        content_attributes: { items: buttons }
      }
    )
  end

  def process_action(message, action)
    case action
    when 'handoff'
      message.conversation.open!
    when 'resolve'
      message.conversation.resolved!
    end
  end
end
