class Integrations::Csml::ProcessorService < Integrations::BotProcessorService
  private

  def csml_bot
    @csml_bot ||= CsmlBot.find(hook.settings['csml_bot_id'])
  end

  def get_response(session_id, content)
    @csml_engine = CsmlEngine.new(GlobalConfigService.load('CSML_BOT_HOST', ''), GlobalConfigService.load('CSML_BOT_API_KEY', ''))
    @csml_engine.run(
      bot_payload,
      {
        client: client_params(session_id),
        payload: message_payload(content),
        metadata: metadata_params
      }
    )
  end

  def client_params(session_id)
    {
      bot_id: "chatwoot-bot-#{conversation.inbox.id}",
      channel_id: "chatwoot-bot-inbox-#{conversation.inbox.id}",
      user_id: session_id
    }
  end

  def message_payload(content)
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
      process_text_messages(message_payload, conversation)
    when 'question'
      process_question_messages(message_payload, conversation)
    end
  end

  def process_text_messages(message_payload, conversation)
    conversation.messages.create(
      {
        message_type: :outgoing,
        account_id: conversation.account_id,
        inbox_id: conversation.inbox_id,
        content: message_payload['content']['text']
      }
    )
  end

  def process_question_messages(message_payload, conversation)
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
end
