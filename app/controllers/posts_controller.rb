class PostsController < ApplicationController
  respond_to :json, :html
  # GET /posts
  # GET /posts.xml
  def index
    
    query = {}
    
    @json = Post.all.to_gmaps4rails
    
    unless params['scope']
      params['scope'] = 'all'
    end
    
    if params['cat'] && params['cat'] != 'all'
      query['category'] = params['cat'].capitalize()
    else
      params['cat'] = 'all'
    end
    
    if params['type'] && params['type'] != 'all'
      query['post_type'] = params['type'].capitalize()
    end
    
    if params['item'] && params['item'] != 'all'
      query['item'] = params['item']
    else
      params['item'] = 'all'
    end
    
    # logger.debug "params is hello #{params}"
    @posts = Post.where(query)
    # @posts = Post.order("name").page(query).per(2)
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @posts }
      format.json { render :json => @posts }
    end
  end

  # GET /posts/1
  # GET /Posts/1.xml
  def show
    @post = Post.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @post }
    end
  end

  # GET /posts/new
  # GET /posts/new.xml
  def new
    unless require_user
      return
    end
    
    @post = Post.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @post }
    end
  end

  # GET /posts/1/edit
  def edit
    unless require_user
      return
    end
    
    @post = Post.find(params[:id])
  end

  # POST /posts
  # POST /posts.xml
  def create
    unless require_user
      return
    end
    
    @post = Post.new(params[:post])
    
    # logger.debug "New user #{current_user}"
    
    @post.user_id = current_user.id;
    
    respond_to do |format|
      if @post.save
        format.html { redirect_to(@post, :notice => 'Post was successfully created.') }
        format.xml  { render :xml => @post, :status => :created, :location => @post }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @post.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /posts/1
  # PUT /posts/1.xml
  def update
    unless require_user
      return
    end
    
    @post = Post.find(params[:id])

    respond_to do |format|
      if @post.update_attributes(params[:post])
        format.html { redirect_to(@post, :notice => 'Post was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @post.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.xml
  def destroy
    unless require_user
      return
    end
    
    @post = Post.find(params[:id])
    @post.destroy

    respond_to do |format|
      format.html { redirect_to(posts_url) }
      format.xml  { head :ok }
    end
  end
  
end
