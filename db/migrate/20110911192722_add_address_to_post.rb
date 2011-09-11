class AddAddressToPost < ActiveRecord::Migration
  def self.up
    add_column :posts, :address, :string
  end

  def self.down
    remove_column :posts, :address
  end
end
