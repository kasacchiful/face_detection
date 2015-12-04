require 'net/http'
require 'uri'
require 'json'

class AlchemyAPI

  def initialize
    @vcap = ENV['VCAP_SERVICES'] ? JSON.parse(ENV['VCAP_SERVICES']) : nil
    if @vcap && @vcap['alchemy_api']
      @endpoint = File.join(@vcap['alchemy_api'][0]['credentials']['url'], '/image/ImageGetRankedImageFaceTags')
      @apikey = @vcap['alchemy_api'][0]['credentials']['apikey']
    end

    return { status: 'ERROR', info: 'endpoint or apikey is empty.' } unless @endpoint && @apikey
  end

  def analyze(image, options = {})
    url = @endpoint
    options[:apikey] = @apikey
    options[:outputMode] = 'json'

    url += '?'
    options.each { |k,v| url += "#{k}=#{v}&" }

    uri = URI.parse(url)
    request = Net::HTTP::Post.new(uri.request_uri)
    request.body = image.to_s
    request['Accept-Encoding'] = 'identity'
    options = {}
    options[:use_ssl] = true if url[0,5] == 'https'

    res = Net::HTTP.start(uri.host, uri.port, options) do |http|
      http.request(request)
    end

    return JSON.parse(res.body)
  end

end
