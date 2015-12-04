require 'base64'

class FaceImage
  attr_reader :file

  def initialize(data_uri)
    @file = convert_file(data_uri)
  end

  private

  def convert_file(data_uri)
    image_data = split_base64(data_uri)

    image_file = Tempfile.new('face_tmp')
    image_file.binmode
    image_file << Base64.decode64(image_data[:data])
    image_file.rewind

    return image_file
  end

  def split_base64(data_uri)
    if data_uri.match(%r{data:(.*?);(.*?),(.*)$})
      uri = Hash.new
      uri[:type] = $1
      uri[:encode] = $2
      uri[:data] = $3
      uri[:ext] = $1.split('/')[1]
      return uri
    else
      return nil
    end
  end
end
