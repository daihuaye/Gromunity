class MessagesController < ApplicationController
  # GET /messages
  # GET /messages.xml
  def index
    # @messages = Message.all
    @message = nil
    if current_user.messages.where(:sender_id => current_user.id)
      @message = current_user.messages.where(:sender_id => current_user.id)
      logger.debug "Show in the message index"
    end

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @messages }
    end
  end

  # GET /messages/1
  # GET /messages/1.xml
  def show
    @message = current_user.messages.where(:sender_id => current_user.id)
    # logger.debug "Show in the messages"
    # debugger
    # if current_user.messages
    #   @message = current_user.messages(params[:id])
    # end
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @message }
    end
  end

  # GET /messages/new
  # GET /messages/new.xml
  def new
    @message = Message.new(:sender_id => current_user.id, :recipient_id => params[:id])
    
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @message }
    end
  end

  # GET /message/new/:user_id
  # GET /message/new/:user_id.xml  
  def send_message
    # logger.debug  "params is #{params}"
    @message = current_user.messages.build(:user_id => current_user.id, :sender_id => current_user.id, :recipient_id => params[:id])
    @message.save
    respond_to do |format|
      format.html # send_message.html.erb
      # format.xml  { render :xml => @message }
    end    
  end
  
  # PUT /posts/1
  # PUT /posts/1.xml
  def update    
    @message = current_user.messages.where(:sender_id => current_user.id).last
    
  # @message.title = params[:message][:title]
  # @message.body  = params[:message][:body]
    
    # @message.save
    
    respond_to do |format|
      if @message.update_attributes(params[:message])
        format.html { redirect_to(@message, :notice => 'Message was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @message.errors, :status => :unprocessable_entity }
      end
    end
  end  
  # POST /messages
  # POST /messages.xml
  def create
    @message = Message.new(params[:message])
    
    
    respond_to do |format|
      if @message.save
        format.html { redirect_to(@message, :notice => 'Message was successfully sent.') }
        format.xml  { render :xml => @message, :status => :created, :location => @message }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @message.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /messages/1
  # DELETE /messages/1.xml
  def destroy
    @message = Message.find(params[:id])
    @message.destroy

    respond_to do |format|
      format.html { redirect_to(messages_url) }
      format.xml  { head :ok }
    end
  end
  
  # def myMessage
  #   @message = []
  #   @user = current_user
  #   if current_user.messages.where(:send_id => current_user.id)
  #     @message = current_user.messages.where(:send_id => current_user.id)
  #   end
  #   # @message_receive = urrent_user.messages.find_by_recipient_id(current_user.id)
  #   respond_to do |format|
  #     format.html 
  #     # format.html { redirect_to :action => 'show', :id => @user.id }
  #   end
  #   
  # end
end
