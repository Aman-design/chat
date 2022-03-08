json.array! @csml_bots do |csml_bot|
  json.partial! 'api/v1/models/csml_bot.json.jbuilder', resource: csml_bot
end
