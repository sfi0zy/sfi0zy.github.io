require "open-uri"
require "mimemagic"
require "base64"


module Jekyll
    module UrlToBase64
        def urltobase64(url)
            image = open(url.strip)
            data_type = MimeMagic.by_magic(image)
            encoded_image = Base64.strict_encode64(image.read)
            image.close

            "data:#{data_type};base64,#{encoded_image}"
        end
    end
end


Liquid::Template.register_filter(Jekyll::UrlToBase64)
