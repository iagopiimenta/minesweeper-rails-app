# frozen_string_literal: true

Rails.application.routes.draw do
  resources :games

  root to: "games#new"
end
