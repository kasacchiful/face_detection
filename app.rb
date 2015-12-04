require 'sinatra'
require 'slim'
require 'json'
require_relative 'models/alchemy_api'
require_relative 'models/face_image'

get '/' do
  slim :index
end

post '/api/v1/face' do
  request.body.rewind
  body = JSON.parse(request.body.read)

  image = FaceImage.new(body['uri'])
  api = AlchemyAPI.new
  res = api.analyze(File.binread(image.file.path), { imagePostMode: 'raw' })
  data = []
  data = res['imageFaces'] if res['status'] == 'OK' && res.key?('imageFaces')

  content_type :json
  data.to_json
end
