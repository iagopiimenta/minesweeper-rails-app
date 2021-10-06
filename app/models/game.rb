class Game < ApplicationRecord
  enum state: [ :pending_mining, :playing, :game_over ], _prefix: true, _default: :pending_mining

  attribute :tiles, default: -> { {} }

  before_save :change_state, if: :state_pending_mining?

  private

  def change_state
    self.state = self.class.states[:playing] if tiles.keys.any?
  end
end
