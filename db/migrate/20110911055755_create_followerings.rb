class CreateFollowerings < ActiveRecord::Migration
  def self.up
    create_table :followerings do |t|
      t.integer :user_id
      t.integer :following_user_id

      t.timestamps
    end
  end

  def self.down
    drop_table :followerings
  end
end
