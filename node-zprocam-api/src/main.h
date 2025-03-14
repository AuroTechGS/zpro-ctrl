#ifndef MAIN_H
#define MAIN_H

struct tfCase {
	int cam_space_all = 0;
	int cam_space_free = 0;
};
struct CamearParams {
    int fps;
    int resolution;
    int bitrate;
    int shutter;
    int iso;
    int encType;
    int aeMode;
};

class CameraInfo
{
public:
    std::string m_ipAdre;
    std::string m_camName;
    int onlineStatus;
};

class FileInfo {
    public:
    std::string m_fileName;
    int m_times;
};

class CameraCtrlBase
{
public:
    CameraCtrlBase();
    ~CameraCtrlBase();
    std::vector<CameraInfo> getCameraList();
    int m_initCamera(std::string cam_ip, int camNum);
    int getSyncCam();
    bool startSyncCam();
    int camReboot();
    int setFrameRate(int frameRate);
    int getFrameRate();
    int storageFormat();
    int setResolution(int resolution);
    int getResolution();
    int CameraStorageFormat();
    int CameraSyncStart();
    int CameraSyncStatus();
    int startSnap();
    int camera_tf_format();
    int camera_shoot_start();
    int setCamBitrate(int bitrate);
    int setCaptShutter(int shutter);
    int setCaptISO(int isoNum);
    int setCaptEnc(int encType);
    int setAeMode(int aeType);
    FileInfo camera_shoot_end();
    tfCase getTFCase();
    CamearParams getCameraParams();
 
private:
    bool m_init_status;
    bool m_transcribe_status;
    std::string m_cam_ip;
    int m_camNum;
    int m_sync_status;
    std::vector<CameraInfo> m_cameraArray;
    int m_frameRate;
    int m_resolution;
    int m_syncStatus;
};
#endif