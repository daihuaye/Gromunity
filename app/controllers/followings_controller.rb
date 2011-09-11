class FollowingsController < ApplicationController
  def create
    @following = current_user.followings.build(:user_id => current_user.id)
  end

end
