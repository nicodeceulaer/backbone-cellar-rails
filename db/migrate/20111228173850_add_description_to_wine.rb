class AddDescriptionToWine < ActiveRecord::Migration
  def change
    add_column :wines, :description, :text
  end
end
