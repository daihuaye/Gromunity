class Post < ActiveRecord::Base
  belongs_to :user
  validates_presence_of :category, :post_type, :item
  
  acts_as_gmappable
  
  def gmaps4rails_address
    address
  end
end
