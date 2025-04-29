#include <napi.h>
#include "main.h"



class ZproCtrl : public Napi::ObjectWrap<ZproCtrl>, public CameraCtrlBase
{
public:
  static Napi::FunctionReference constructor;
  ZproCtrl(const Napi::CallbackInfo &info) : Napi::ObjectWrap<ZproCtrl>(info), CameraCtrlBase() {}

  static Napi::Object Init(Napi::Env env, Napi::Object exports)
  {
    Napi::Function func = DefineClass(env, "ZproCtrl", {
        InstanceMethod("initMyCamera", &ZproCtrl::initMyCamera),
        InstanceMethod("getCamList", &ZproCtrl::getCamList),
        InstanceMethod("setSyncCam", &ZproCtrl::setSyncCam),
        InstanceMethod("getSyncStatusCam", &ZproCtrl::getSyncStatusCam),
        InstanceMethod("setCamFrameRate", &ZproCtrl::setCamFrameRate),
        InstanceMethod("getCamFrameRate", &ZproCtrl::getCamFrameRate),
        InstanceMethod("rebootCam", &ZproCtrl::rebootCam),
        InstanceMethod("storageFormat", &ZproCtrl::storageFormat),
        InstanceMethod("camSyncStart", &ZproCtrl::camSyncStart),
        InstanceMethod("getcamSyncStatus", &ZproCtrl::getcamSyncStatus),
        InstanceMethod("startCamSnap", &ZproCtrl::startCamSnap),
        InstanceMethod("setCamFormatTf", &ZproCtrl::setCamFormatTf),
        InstanceMethod("startCamshoot", &ZproCtrl::startCamshoot),
        InstanceMethod("endCamshoot", &ZproCtrl::endCamshoot),
        InstanceMethod("getTfCaseInfo", &ZproCtrl::getTfCaseInfo),
        InstanceMethod("setCamResolutionRate", &ZproCtrl::setCamResolutionRate),
        InstanceMethod("setCamsBit", &ZproCtrl::setCamsBit),
        InstanceMethod("setCamsShutter", &ZproCtrl::setCamsShutter),
        InstanceMethod("setCamsISO", &ZproCtrl::setCamsISO),
        InstanceMethod("setCamsEnc", &ZproCtrl::setCamsEnc),
        InstanceMethod("setCamsAeMode", &ZproCtrl::setCamsAeMode),
        InstanceMethod("getCaptParamsInfo", &ZproCtrl::getCaptParamsInfo),
    });
    constructor = Napi::Persistent(func);
    constructor.SuppressDestruct();
    exports.Set("ZproCtrl", func);
    return exports;
  }

  Napi::Value initMyCamera(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    if (info.Length() > 0 && info[0].IsString())
    {
      std::string cam_ip = info[0].As<Napi::String>().Utf8Value();
      int num = info[1].As<Napi::Number>().Int32Value();
      int result = this->m_initCamera(cam_ip, num);
      return Napi::Number::New(env, result);
    }
    return Napi::Number::New(env, -1);
  };

  Napi::Value getCamList(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    std::vector<CameraInfo> camBaseList = this->getCameraList();
    Napi::Array camList = Napi::Array::New(env, camBaseList.size());
    for (size_t i = 0; i < camBaseList.size(); ++i)
    {
      const CameraInfo &camInfo = camBaseList[i];
      Napi::Object camObj = Napi::Object::New(env);
      camObj.Set("camName", Napi::String::New(env, camInfo.m_camName));
      camObj.Set("ipAddr", Napi::String::New(env, camInfo.m_ipAdre));
      camObj.Set("onlineStatus", Napi::Number::New(env, camInfo.onlineStatus));
      camList.Set(i, camObj);
    }
    return camList;
  };
  Napi::Value setSyncCam(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    bool result = this->startSyncCam();
    return Napi::Boolean::New(env, result);
  };

  Napi::Value getSyncStatusCam(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    int result = this->getSyncCam();
    return Napi::Number::New(env, result);
  };

  Napi::Value setCamFrameRate(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    if (info.Length() > 0 && info[0].IsNumber())
    {
      int fps_num = info[0].As<Napi::Number>().Int32Value();
      int result = this->setFrameRate(fps_num);
      return Napi::Number::New(env, result);
    }
    return Napi::Number::New(env, -1);
  };

  Napi::Value getCamFrameRate(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    int result = this->getFrameRate();
    return Napi::Number::New(env, result);
  };
  Napi::Value rebootCam(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    int result = this->camReboot();
    return Napi::Number::New(env, result);
  };
  Napi::Value storageFormat(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    int result = this->CameraStorageFormat();
    return Napi::Number::New(env, result);
  };
  Napi::Value camSyncStart(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    int result = this->CameraSyncStart();
    return Napi::Number::New(env, result);
  };
  Napi::Value getcamSyncStatus(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    int result = this->CameraSyncStatus();
    return Napi::Number::New(env, result);
  };
  Napi::Value setCamFormatTf(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    int result = this->camera_tf_format();
    return Napi::Number::New(env, result);
  };
  Napi::Value startCamSnap(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    int result = this->startSnap();
    return Napi::Number::New(env, result);
  };
  Napi::Value startCamshoot(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    int result = this->camera_shoot_start();
    return Napi::Number::New(env, result);
  };
  Napi::Value endCamshoot(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    FileInfo result = this->camera_shoot_end();
    Napi::Object camObj = Napi::Object::New(env);
    camObj.Set("fileName", Napi::String::New(env, result.m_fileName));
    camObj.Set("times", Napi::Number::New(env, result.m_times));
    return camObj;
  };
  Napi::Value getTfCaseInfo(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    tfCase result = this->getTFCase();
    Napi::Object camObj = Napi::Object::New(env);
    camObj.Set("amSpaceAll", Napi::Number::New(env, result.cam_space_all));
    camObj.Set("camSpacefree", Napi::Number::New(env, result.cam_space_free));
    return camObj;
  };
  Napi::Value getCaptParamsInfo(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    CamearParams result = this->getCameraParams();
    Napi::Object camObj = Napi::Object::New(env);
    camObj.Set("resolution", Napi::Number::New(env, result.resolution));
    camObj.Set("fps", Napi::Number::New(env, result.fps));
    camObj.Set("encType", Napi::Number::New(env, result.encType));
    camObj.Set("bitrate", Napi::Number::New(env, result.bitrate));
    camObj.Set("aeMode", Napi::Number::New(env, result.aeMode));
    camObj.Set("iso", Napi::Number::New(env, result.iso));
    camObj.Set("shutter", Napi::Number::New(env, result.shutter));
    return camObj;
  };
  

  Napi::Value setCamResolutionRate(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    if (info.Length() > 0 && info[0].IsNumber())
    {
      int resolution = info[0].As<Napi::Number>().Int32Value();
      int result = this->setResolution(resolution);
      return Napi::Number::New(env, result);
    }
    return Napi::Number::New(env, -1);
  };
  Napi::Value setCamsBit(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    if (info.Length() > 0 && info[0].IsNumber())
    {
      int resolution = info[0].As<Napi::Number>().Int32Value();
      int result = this->setCamBitrate(resolution);
      return Napi::Number::New(env, result);
    }
    return Napi::Number::New(env, -1);
  };
  Napi::Value setCamsShutter(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    if (info.Length() > 0 && info[0].IsNumber())
    {
      int resolution = info[0].As<Napi::Number>().Int32Value();
      int result = this->setCaptShutter(resolution);
      return Napi::Number::New(env, result);
    }
    return Napi::Number::New(env, -1);
  };
  Napi::Value setCamsISO(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    if (info.Length() > 0 && info[0].IsNumber())
    {
      int resolution = info[0].As<Napi::Number>().Int32Value();
      int result = this->setCaptISO(resolution);
      return Napi::Number::New(env, result);
    }
    return Napi::Number::New(env, -1);
  };
  Napi::Value setCamsEnc(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    if (info.Length() > 0 && info[0].IsNumber())
    {
      int resolution = info[0].As<Napi::Number>().Int32Value();
      int result = this->setCaptEnc(resolution);
      return Napi::Number::New(env, result);
    }
    return Napi::Number::New(env, -1);
  };
  Napi::Value setCamsAeMode(const Napi::CallbackInfo &info)
  {
    Napi::Env env = info.Env();
    if (info.Length() > 0 && info[0].IsNumber())
    {
      int resolution = info[0].As<Napi::Number>().Int32Value();
      int result = this->setAeMode(resolution);
      return Napi::Number::New(env, result);
    }
    return Napi::Number::New(env, -1);
  };
};

Napi::FunctionReference ZproCtrl::constructor;

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  ZproCtrl::Init(env, exports);
  return exports;
}

NODE_API_MODULE(addonZpro, Init)
