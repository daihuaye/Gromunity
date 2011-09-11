class AddGmapsToPost < ActiveRecord::Migration
  def self.up
    add_column :posts, :gmaps, :boolean
  end

  def self.down
    remove_column :posts, :gmaps
  end
end
