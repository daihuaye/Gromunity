class Post < ActiveRecord::Base
  belongs_to :user
  validates_presence_of :category, :post_type, :item
end
