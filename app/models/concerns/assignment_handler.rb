module AssignmentHandler
  extend ActiveSupport::Concern
  include Events::Types

  included do
    before_save :ensure_assignee_is_from_team
    after_commit :notify_assignment_change, :process_assignment_activities
  end

  private

  def ensure_assignee_is_from_team
    return unless team_id_changed?

    validate_current_assignee_team
    set_assignee_from_team if assignee.blank?
  end

  def validate_current_assignee_team
    self.assignee_id = nil if team&.members&.exclude?(assignee)
  end

  def set_assignee_from_team
    return if team&.allow_auto_assign.blank?

    team_members = inbox.members.ids & team.members.ids
    ::RoundRobin::AssignmentService.new(conversation: self, allowed_member_ids: team_members).perform
  end

  def notify_assignment_change
    {
      ASSIGNEE_CHANGED => -> { saved_change_to_assignee_id? },
      TEAM_CHANGED => -> { saved_change_to_team_id? }
    }.each do |event, condition|
      condition.call && dispatcher_dispatch(event)
    end
  end

  def process_assignment_activities
    user_name = Current.user.name if Current.user.present?
    if saved_change_to_team_id?
      create_team_change_activity(user_name)
    elsif saved_change_to_assignee_id?
      create_assignee_change_activity(user_name)
    end
  end
end
