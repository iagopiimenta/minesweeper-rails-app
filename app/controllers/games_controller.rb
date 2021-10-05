class GamesController < ApplicationController
  before_action :load_game, only: [:show, :update]

  def index
  end

  def new
    @game = Game.new
  end

  def show
    respond_to do |format|
      format.html
      format.json  { render json: @game }
    end
  end

  # TODO: handle errors
  def create
    @game = Game.create!(game_params)

    redirect_to @game
  end

  def update
    @game.update!(game_params)

    render json: @game
  end

  private

  def load_game
    @game = Game.find(params[:id])
  end

  def game_params
    params.require(:game).permit(:height, :width, :state, tiles: {})
  end
end
