{
  "targets": [
    {
      "target_name": "addonZpro",
      "sources": [
        "src/addonZpro.cc",
        "src/main.cpp",
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "./src",
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "cxxflags": [ "-std=c++17" ], 
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": ["NAPI_CPP_EXCEPTIONS"],
      "conditions": [
        [
          "OS=='win'",
          {
            "libraries": [
              "-lws2_32",
              "../src/Z_CamArray_SDK.lib",
              "../src/Z_Control_SDK.lib",
            ],
            "copies": [
              {
                "destination": "<(PRODUCT_DIR)",
                "files": [
                  "./src/Z_CamArray_SDK.dll",
                  "./src/Z_Control_SDK.dll",
                  "./src/config/z2proConfig.json",
                ]
              }]
            }
        ]
      ]
    }
  ]
}