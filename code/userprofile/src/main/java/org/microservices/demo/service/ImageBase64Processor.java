/**
 * ImageBase64Processor
 * Created by: Gbenga Taylor
 * https://github.com/gbengataylor
 *
 * (C) 2019
 * Released under the terms of Apache-2.0 License
 */
package org.microservices.demo.service;

import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Base64;

@Component
public class ImageBase64Processor {

    public  String encodeFileToBase64Binary(File file) throws IOException {
        FileInputStream fileInputStreamReader = new FileInputStream(file);
        byte[] bytes = new byte[(int)file.length()];
        fileInputStreamReader.read(bytes);
        fileInputStreamReader.close();

        return encodToBase64Binary(bytes);
    }

    public  String encodToBase64Binary(byte[] bytes) {
        return Base64.getEncoder().encodeToString(bytes);
    }

    public  byte[] decodeBase64(String base64) {
        return Base64.getDecoder().decode(base64);
    }
}
