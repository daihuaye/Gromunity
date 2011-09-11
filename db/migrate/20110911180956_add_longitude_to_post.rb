class AddLongitudeToPost < ActiveRecord::Migration
  def self.up
    add_column :posts, :longitude, :float
  end

  def self.down
    remove_column :posts, :longitude
  end
end
