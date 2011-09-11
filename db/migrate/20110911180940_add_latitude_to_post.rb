class AddLatitudeToPost < ActiveRecord::Migration
  def self.up
    add_column :posts, :latitude, :float
  end

  def self.down
    remove_column :posts, :latitude
  end
end
