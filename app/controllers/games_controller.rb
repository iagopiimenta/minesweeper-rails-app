class GamesController < ApplicationController
  def index
  end

  def new
    @game = Game.new
  end

  def show
    @game = Game.find(params[:id])
  end

  # TODO: handle errors
  def create
    @game = Game.create!(game_params)

    redirect_to @game
  end

  private

  def game_params
    params.require(:game).permit(:height, :width)
  end
end
