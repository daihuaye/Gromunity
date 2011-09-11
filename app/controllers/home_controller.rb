class HomeController < ApplicationController
  def index
    params['scope'] = 'all'
    params['cat'] = 'all'
    
    @posts = Post.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @posts }
    end
  end
end
