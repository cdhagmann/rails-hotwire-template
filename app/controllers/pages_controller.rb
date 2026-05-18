class PagesController < ApplicationController
  def index
    # render Views::Pages::Index.new
  end

  def countdown_demo
    # This action will render app/views/pages/countdown_demo.html.erb
  end

  def timer_demo
    # This action will render app/views/pages/timer_demo.html.erb
  end
end
