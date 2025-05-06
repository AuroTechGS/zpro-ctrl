#include <iostream>
#include <string>
#include <vector>
#include "main.h"
#include "Z_CamArray_SDK.h"
#include <thread> // for std::this_thread::sleep_for
#include <chrono> // for std::chrono::milliseconds

CameraCtrlBase::CameraCtrlBase()
{
    m_init_status = false;
    m_camNum = 0;
    m_sync_status = -1;
    m_frameRate = -1;
    m_resolution = -1;
    m_syncStatus = -1;
};

CameraCtrlBase::~CameraCtrlBase() {};

int CameraCtrlBase::m_initCamera(std::string cam_ip, int allNum)
{
    m_camNum = 0;
    if (!m_init_status)
    {
        int initSDK = Z_CamArray_SDK_Init();
        std::cout << "Z_CamArray_SDK_Init: " << initSDK << " - " << cam_ip << std::endl;
        if (initSDK != 0)
        {
            return -1;
        }
        m_init_status = true;
    }
    m_cam_ip = cam_ip;
    char *camIpPtr = const_cast<char *>(cam_ip.c_str());
    Z_CamArray_Search(camIpPtr);
    int search_status = 1;
    Z_CAMERA_SEARCH_INFO camera_list[256];
    int searchNum = 0;
    while (searchNum < 10)
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(3000));
        search_status = Z_CamArray_Search_Status(&m_camNum, camera_list);
        std::cout << "Z_CamArray_Search_Status_loading: " << search_status << " - " << m_camNum << std::endl;
        searchNum++;
        if (search_status == 0 && m_camNum != allNum)
        {
            Z_CamArray_Search(camIpPtr);
        }
        if (search_status == 0 && m_camNum == allNum)
        {
            break;
        }
    }

    int secondNum = 0;
    if (m_camNum != allNum)
    {
        Z_CamArray_Search(camIpPtr);
        while (secondNum < 6)
        {
            std::this_thread::sleep_for(std::chrono::milliseconds(3000));
            search_status = Z_CamArray_Search_Status(&m_camNum, camera_list);
            if (search_status == 0)
            {
                break;
            }
        }
    }
    std::cout << "Z_CamArray_Search_Status_end: " << search_status << " - " << m_camNum << std::endl;
    if (search_status != 0)
    {
        return -2;
    }
    // 获取检索相机结果  相机列表
    m_cameraArray.clear();
    for (int i = 0; i < m_camNum; i++)
    {
        CameraInfo camInfo;
        camInfo.m_camName = std::string(reinterpret_cast<char *>(camera_list[i].camerName));
        camInfo.m_ipAdre = std::string(reinterpret_cast<char *>(camera_list[i].ipAddr));
        m_cameraArray.push_back(camInfo);
    }
    if (m_cameraArray.size() > 0)
    {
        int camera_status[512] = {0};
        int retOnline = Z_CamArray_Status(camera_status);
        if (retOnline != 0)
        {
            return -4;
        }
        else
        {
            for (int i = 0; i < m_cameraArray.size(); i++)
            {
                m_cameraArray[i].onlineStatus = camera_status[i];
            }
        }
    }
    return 1;
};

int CameraCtrlBase::startSnap()
{
    int ret = Z_CamArray_Snap();
    if (ret != 0)
    {
        return -1;
    }
    return 0;
}

bool CameraCtrlBase::startSyncCam()
{
    int ret = Z_CamArray_Sync_Start();
    std::cout << "Z_CamArray_Sync_Start: " << ret << " - " << "set Px" << std::endl;
    return ret == 0;
}

int CameraCtrlBase::getSyncCam()
{
    int ret = Z_CamArray_Sync_Status(&m_sync_status);
    std::cout << "get_sync_status: " << m_sync_status << std::endl;
    return m_sync_status;
}

std::vector<CameraInfo> CameraCtrlBase::getCameraList()
{
    return m_cameraArray;
}

int CameraCtrlBase::setFrameRate(int frameRate)
{
    if (frameRate == 25 || frameRate == 50)
    {
        int ret = Z_CamArray_Framerate_Set(frameRate);
        std::cout << "Z_CamArray_Framerate_Set:" << ret << std::endl;
        if (ret != 0)
        {
            return -1;
        }
        m_frameRate = frameRate;
        return 1;
    }
    else
    {
        return -2;
    }
}

int CameraCtrlBase::getFrameRate()
{
    if (m_frameRate == -1)
    {
        int ret = Z_CamArray_Framerate_Get(&m_frameRate);
        m_frameRate = ret;
        if (ret != 0)
        {
            return -2;
        }
        return m_frameRate;
    }
    else
    {
        return m_frameRate;
    }
}

int CameraCtrlBase::storageFormat()
{
    int ret = Z_CamArray_Storage_Format();
    if (ret != 0)
    {
        return -1;
    }
    return 0;
}

int CameraCtrlBase::setResolution(int resolution)
{
    if (resolution == 1 || resolution == 2 || resolution == 3)
    {
        int ret = Z_CamArray_Image_Pixel_Set(resolution);
        std::cout << "Z_CamArray_Image_Pixel_Set:" << ret << std::endl;
        if (ret != 0)
        {
            return -1;
        }
        m_resolution = resolution;
        return 1;
    }
    else
    {
        return -1;
    }
}

int CameraCtrlBase::getResolution()
{
    if (m_resolution == -1)
    {
        int ret = Z_CamArray_Image_Pixel_Get(&m_resolution);
        if (ret != 0)
        {
            return -1;
        }
        return m_resolution;
    }
    else
    {
        return m_resolution;
    }
}

int CameraCtrlBase::camReboot()
{
    int ret = Z_CamArray_Reboot();
    if (ret != 0)
    {
        return -1;
    }
    return 0;
}

int CameraCtrlBase::CameraStorageFormat()
{
    int ret = Z_CamArray_Storage_Format();
    if (ret != 0)
    {
        return -1;
    }
    return 0;
}

int CameraCtrlBase::CameraSyncStart()
{
    int ret = Z_CamArray_Sync_Start();
    if (ret != 0)
    {
        return -1;
    }
    return 0;
}

int CameraCtrlBase::CameraSyncStatus()
{
    int sync_status = 0;
    int retStatus = Z_CamArray_Sync_Status(&sync_status);
    m_syncStatus = sync_status;
    if (retStatus != 0)
    {
        return -1;
    }
    return 0;
}

int CameraCtrlBase::camera_tf_format()
{
    int ret = Z_CamArray_Storage_Format();
    if (ret != 0)
    {
        return -1;
    }
    return 0;
}

int CameraCtrlBase::camera_shoot_start()
{
    int ret = Z_CamArray_Record_Start();
    std::cout << "camera_shoot_start: " << ret << std::endl;
    if (ret != 0)
    {
        return -1;
    }
    return 0;
}

FileInfo CameraCtrlBase::camera_shoot_end()
{
    int ret = Z_CamArray_Record_Stop();
    if (ret != 0)
    {
        return {};
    }
    std::cout << "camera_shoot_end: " << ret << "end-shoot" << std::endl;
    int status = -1;
    int times = 0;
    char camShootFil[1024] = "";
    int searchTime = 0;
    while (status != 2)
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(1000));
        int m = Z_CamArray_Record_Status(&status, &times, camShootFil);
        searchTime++;
        if (searchTime > 10 && status != 2)
        {
            status = -1;
            break;
        }
    }
    std::cout << "Z_CamArray_Record_Status: " << status << "-Z_CamArray_Record_tiem:" << times << "-filename:" << std::string(camShootFil) << std::endl;
    if (status != 2)
    {
        return {};
    }
    FileInfo downfile;
    downfile.m_fileName = std::string(camShootFil);
    downfile.m_times = times;
    return downfile;
}

tfCase CameraCtrlBase::getTFCase()
{
    int status = 0;
    int cam_space_all = 0;
    int cam_space_free = 0;
    tfCase t1;
    int tfSearchNum = 0;
    while (tfSearchNum <= 10)
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(1000));
        Z_CamArray_Storage_Status(&status, &cam_space_all, &cam_space_free);
        tfSearchNum++;
        if (status == 0)
        {
            break;
        }
    }
    t1.cam_space_all = cam_space_all;
    t1.cam_space_free = cam_space_free;
    std::cout << "Z_CamArray_Storage_Status: " << status << "-Z_CamArray_Storage_tiem:" << cam_space_all << "-Z_CamArray_Storage_tiem:" << cam_space_free << std::endl;
    return t1;
}

int CameraCtrlBase::setCamBitrate(int bitrate)
{
    int ret = Z_CamArray_Bitrate_Set(bitrate);
    std::cout << "Z_CamArray_Bitrate_Set:" << ret << std::endl;
    if (ret != 0)
    {
        return -1;
    }
    return 1;
}

int CameraCtrlBase::setCaptShutter(int shutter)
{
    int ret = Z_CamArray_Shutter_Set(shutter);
    std::cout << "Z_CamArray_Shutter_Set:" << ret << std::endl;
    if (ret != 0)
    {
        return -1;
    }
    return 1;
}
int CameraCtrlBase::setCaptISO(int isoNum)
{
    int ret = Z_CamArray_ISO_Set(isoNum);
    std::cout << "Z_CamArray_ISO_Set:" << ret << std::endl;
    if (ret != 0)
    {
        return -1;
    }
    return 1;
}

int CameraCtrlBase::setCaptEnc(int encType)
{
    int ret = Z_CamArray_Video_Enc_Type_Set(encType);
    std::cout << "Z_CamArray_Video_Enc_Type_Set:" << ret << std::endl;
    if (ret != 0)
    {
        return -1;
    }
    return 1;
}

int CameraCtrlBase::setAeMode(int aeType)
{
    int ret = Z_CamArray_AE_Mode_Set(aeType);
    std::cout << "Z_CamArray_AE_Mode_Set:" << ret << std::endl;
    if (ret != 0)
    {
        return -1;
    }
    return 1;
}
int CameraCtrlBase::setAWB()
{
    int ret = Z_CamArray_AWB_Set(1);
    std::cout << "Z_CamArray_AWB_Set:" << ret << std::endl;
    if (ret != 0)
    {
        return -1;
    }
    return 1;
}


CamearParams CameraCtrlBase::getCameraParams()
{
    CamearParams camParams;
    int resolution = 0, fps = 0, encType = 0, bitrate = 0, aeMode = 0, shutter = 0, isoVal = 0;
    int res1 = Z_CamArray_Image_Pixel_Get(&resolution);
    int res2 = Z_CamArray_Framerate_Get(&fps);
    int res3 = Z_CamArray_Video_Enc_Type_Get(&encType);
    int res4 = Z_CamArray_Bitrate_Get(&bitrate);
    int res5 = Z_CamArray_AE_Mode_Get(&aeMode);
    int res6 = Z_CamArray_Shutter_Get(1, &shutter);
    int res7 = Z_CamArray_ISO_Get(1, &isoVal);

    std::cout << "res6: " << res6 << " -- " << "shutter: " << shutter << std::endl;
    camParams.resolution = resolution;
    camParams.fps = fps;
    camParams.encType = encType;
    camParams.bitrate = bitrate;
    camParams.aeMode = aeMode;
    camParams.shutter = shutter;
    camParams.iso = isoVal;

    return camParams;
}
