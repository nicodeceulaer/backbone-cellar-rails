class CreateWines < ActiveRecord::Migration
  def change
    create_table :wines do |t|
      t.string :name
      t.string :grapes
      t.string :country
      t.string :region
      t.integer :year
      t.string :picture

      t.timestamps
    end
  end
end
