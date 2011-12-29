class WinesController < ApplicationController
  
  # GET /wines (json)
  def index
    @wines = Wine.all
    render json: @wines
  end

  # GET /wines/1 (json)
  def show
    @wine = Wine.find(params[:id])
    render json: @wine
  end

  # POST /wines (json)
  def create
    @wine = Wine.new(params[:wine])

    if @wine.save
      render json: @wine, status: :created, location: @wine
    else
      render json: @wine.errors, status: :unprocessable_entity
    end
  end

  # PUT /wines/1 (json)
  def update
    @wine = Wine.find(params[:id])

    if @wine.update_attributes(params[:wine])
      format.json { head :ok }
    else
      format.json { render json: @wine.errors, status: :unprocessable_entity }
    end
  end

  # DELETE /wines/1 (json)
  def destroy
    @wine = Wine.find(params[:id])
    @wine.destroy
    
    respond_to do |format|
      format.json { render :json => {'ok' => true} }
    end
  end
end
