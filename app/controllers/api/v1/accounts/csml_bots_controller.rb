class Api::V1::Accounts::CsmlBotsController < Api::V1::Accounts::BaseController
  before_action :fetch_csml_bots, except: [:create]
  before_action :fetch_csml_bot, only: [:show, :update, :destroy]
  before_action :validate_csml_bot, only: [:create, :update]

  def index; end

  def show; end

  def create
    @csml_bot = Current.account.csml_bots.create!(permitted_payload)
  end

  def update
    @csml_bot.update!(permitted_payload)
  end

  def destroy
    @csml_bot.destroy
    head :no_content
  end

  private

  def fetch_csml_bots
    @csml_bots = Current.account.csml_bots
  end

  def fetch_csml_bot
    @csml_bot = Current.account.csml_bots.find(permitted_params[:id])
  end

  def permitted_payload
    params.require(:csml_bot).permit(
      :name,
      :description,
      :bot_config
    )
  end

  def permitted_params
    params.permit(:id, :name, :description, :bot_config)
  end

  def validate_csml_bot
    csml_client = CsmlEngine.new(GlobalConfigService.load('CSML_BOT_HOST', ''), GlobalConfigService.load('CSML_API_KEY', ''))

    response = csml_client.validate(
      {
        id: permitted_payload[:name],
        name: permitted_payload[:name],
        default_flow: 'Default',
        flows: [
          {
            id: SecureRandom.hex,
            name: 'Default',
            content: permitted_params[:bot_config],
            commands: ['trigger keyword']
          }
        ]
      }
    )

    raise ActionController::InvalidAuthenticityToken, 'Invalid Bot Configuration' if response['valid'].blank?
  end
end
