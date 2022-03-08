class CreateCsmlBots < ActiveRecord::Migration[6.1]
  def change
    create_table :csml_bots do |t|
      t.string :name, null: false, index: true
      t.string :description
      t.string :bot_config, null: false
      t.references :account, index: true, null: false

      t.timestamps
    end
  end
end
