require 'sinatra'
require 'slim'
require 'json'

get '/' do
  slim :index
end

post '/api/v1/face' do
  content_type :json
  {}.to_json
end
