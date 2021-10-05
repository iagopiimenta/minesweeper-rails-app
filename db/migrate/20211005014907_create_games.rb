class CreateGames < ActiveRecord::Migration[6.1]
  def change
    create_table :games do |t|
      t.integer :width
      t.integer :height
      t.jsonb :tiles
      t.integer :state

      t.timestamps
    end
  end
end
