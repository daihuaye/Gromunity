class AddCategoryToPost < ActiveRecord::Migration
  def self.up
    add_column :posts, :category, :string
  end

  def self.down
    remove_column :posts, :category
  end
end
