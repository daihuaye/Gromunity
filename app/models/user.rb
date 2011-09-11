class User < ActiveRecord::Base
  acts_as_authentic
  attr_accessible(:login, :email, :password)
end

