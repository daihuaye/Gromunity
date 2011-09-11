class User < ActiveRecord::Base
  has_many :posts
  has_many :followerings
  acts_as_authentic
  validates_presence_of :login
  validates_uniqueness_of :email
end

