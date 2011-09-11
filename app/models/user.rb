class User < ActiveRecord::Base
  has_many :posts
  has_many :followings
  has_many :messages
  acts_as_authentic
  validates_presence_of :login
  validates_uniqueness_of :email
end

