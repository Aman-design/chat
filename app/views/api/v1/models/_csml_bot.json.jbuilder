json.id resource.id
json.name resource.name
json.description resource.description
json.bot_config resource.bot_config

if connected_inboxes.present?
  json.inboxes connected_inboxes.map do |connect_inbox|
    json.partial! 'api/v1/models/inbox.json.jbuilder', resource: connect_inbox.inbox
  end
end
