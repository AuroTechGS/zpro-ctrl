#ifndef __Z_CAM_ARRAY_SDK_H__
#define __Z_CAM_ARRAY_SDK_H__

#ifdef __cplusplus 
extern "C" {
#endif

#include <stdio.h> 

#ifdef Z_CAM_ARRAY_SDK_API

#else
#define Z_CAM_ARRAY_SDK_API	_declspec(dllimport)
#endif


typedef struct _Z_CAMERA_SEARCH_INFO_
{
	unsigned char ipAddr[64];
	unsigned char camerName[64];
} Z_CAMERA_SEARCH_INFO;


/*********************************************
	@api:	int Z_CamArray_SDK_Init(void)
	@func:	SDK初始化
	@para:			
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_SDK_Init(void);


/*********************************************
	@api:	int Z_CamArray_SDK_DeInit(void)
	@func:	SDK反初始化
	@para:			
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_SDK_DeInit(void);


/*********************************************
	@api:	int Z_CamArray_Wait_Cmd_Completed(int timeout_cnt)
	@func:	等待上条指令执行完成
	@para:
			int timeout_cnt：等待超时计数，单位：100ms			
	@return:
			0:执行完成
			-1:等待超时
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Wait_Cmd_Completed(int timeout_cnt);


/*********************************************
	@api:	int Z_CamArray_Search(void)
	@func:	搜索相机组
	@para:
			char* ip_segment:相机组所在网段（例：192.168.1.）
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Search(char* ip_segment);


/*********************************************
	@api:	int Z_CamArray_Search_Result(int* pNum, Z_CAMERA_SEARCH_INFO *pDevInfo)
	@func:	获取搜索结果
	@para:
			int* pNum:相机数量
			Z_CAMERA_SEARCH_INFO *pDevInfo:相机信息
	@return:
			0:搜索完成
			1:正在搜索
			2:搜索出错
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Search_Status(int* pNum, Z_CAMERA_SEARCH_INFO *pDevInfo);


/*********************************************
	@api:	int Z_CamArray_Reboot(void)
	@func:	相机组重启
	@para:			
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Reboot(void);



/*********************************************
	@api:	int Z_CamArray_Status(int status_list[])
	@func:	获取相机状态
	@para:			
			int status_list[]:状态值数组，0-离线， 1-在线
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Status(int status_list[]);


/*********************************************
	@api:	int Z_CamArray_Storage_Status(int* status, int* space_all, int* space_free)
	@func:	获取相机存储状态
	@para:			
			int* status:状态值，0-正常， 1-正在格式化， 2-完成格式化， 3-异常
			int* space_all：总存储容量，单位MB
			int* space_free：剩余存储容量，单位MB
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Storage_Status(int* status, int* space_all, int* space_free);


/*********************************************
	@api:	int Z_CamArray_Storage_Format(void)
	@func:	格式化相机存储
	@para:			
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Storage_Format(void);


/*********************************************
	@api:	int Z_CamArray_Sync_Start(void)
	@func:	开始相机同步
	@para:			
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Sync_Start(void);


/*********************************************
	@api:	int Z_CamArray_Sync_Status(int* status)
	@func:	获取相机同步状态
	@para:	
			int* status：0-未同步， 1-同步完成		
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Sync_Status(int* status);



/*********************************************
	@api:	int Z_CamArray_Snap(void)
	@func:	控制相机拍照
	@para:			
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Snap(void);


/*********************************************
	@api:	int Z_CamArray_Record_Start(void)
	@func:	控制相机开始录像
	@para:			
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Record_Start(void);


/*********************************************
	@api:	int Z_CamArray_Record_Stop(void)
	@func:	控制相机结束录像
	@para:			
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Record_Stop(void);


/*********************************************
	@api:	int Z_CamArray_Record_Status(int* status, int* duration, char* filename)
	@func:	获取录像状态
	@para:	
			int* status：状态值，0-待机, 1-录像中, 2-完成录像
			int* duration：录像时长，单位：秒
			char* filename：录像文件名		
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Record_Status(int* status, int* duration, char* filename);



/*********************************************
	@api:	int Z_CamArray_Image_Pixel_Set(int px)
	@func:	设置相机分辨率
	@para:	
			int px：
				1：720P
				2：1080P
				3：4K	
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Image_Pixel_Set(int px);


/*********************************************
	@api:	int Z_CamArray_Image_Pixel_Get(int* px)
	@func:	获取相机分辨率
	@para:	
			int px：
				1：720P
				2：1080P
				3：4K
				-1：混乱	
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Image_Pixel_Get(int* px);


/*********************************************
	@api:	int Z_CamArray_Framerate_Set(int fps)
	@func:	设置相机帧率
	@para:	
			int fps：帧率值	
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Framerate_Set(int fps);


/*********************************************
	@api:	int Z_CamArray_Framerate_Get(int* fps)
	@func:	获取相机帧率
	@para:	
			int* fps：帧率值
				-1：混乱	
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Framerate_Get(int* fps);



/*********************************************
	@api:	int Z_CamArray_Video_Enc_Type_Set(int type)
	@func:	设置相机视频编码类型
	@para:	
			int type:
				1：H264
				2：H265
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Video_Enc_Type_Set(int type);


/*********************************************
	@api:	int Z_CamArray_Video_Enc_Type_Get(int* type)
	@func:	获取相机视频编码类型
	@para:	
			int* type:
				1：H264
				2：H265
				-1:混乱	
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Video_Enc_Type_Get(int* type);


/*********************************************
	@api:	int Z_CamArray_Bitrate_Set(int bitrate)
	@func:	设置相机视频码率
	@para:	
			int bitrate:单位Mbps
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Bitrate_Set(int bitrate);


/*********************************************
	@api:	int Z_CamArray_Bitrate_Get(int* bitrate)
	@func:	获取相机视频码率
	@para:	
			int* bitrate:单位Mbps
			-1:混乱	
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Bitrate_Get(int* bitrate);



/*********************************************
	@api:	int Z_CamArray_Audio_Enc_Type_Set(int type)
	@func:	设置相机音频编码类型
	@para:	
			int type:
				1:AAC-LC-44.1K-192Kbps
				2:HEAAC-48K-96Kbps
				3:AAC-LC-48K-96Kbps
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Audio_Enc_Type_Set(int type);


/*********************************************
	@api:	int Z_CamArray_Audio_Enc_Type_Get(int* type)
	@func:	获取相机音频编码类型
	@para:	
			int* type:
				1:AAC-LC-44.1K-192Kbps
				2:HEAAC-48K-96Kbps
				3:AAC-LC-48K-96Kbps
				-1:混乱	
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Audio_Enc_Type_Get(int* type);


/*********************************************
	@api:	int Z_CamArray_Audio_Status_Set(int status_list[])
	@func:	设置相机音频编码类型
	@para:	
			int status_list[]:每个成员对应1台相机，1-off，2-on
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Audio_Status_Set(int status_list[]);


/*********************************************
	@api:	int Z_CamArray_Audio_Status_Get(int status_list[])
	@func:	获取相机音频编码类型
	@para:	
			int status_list[]:每个成员对应1台相机，1-off，2-on
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Audio_Status_Get(int status_list[]);



/*********************************************
	@api:	Z_CamArray_AE_Mode_Set(int mode)
	@func:	设置曝光模式
	@para:	
			int mode:
				1:自动
				2:手动				
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_AE_Mode_Set(int mode);


/*********************************************
	@api:	Z_CamArray_AE_Mode_Get(int* mode)
	@func:	获取曝光模式
	@para:	
			int* mode:
				1:自动
				2:手动
				-1:混乱
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_AE_Mode_Get(int* mode);


/*********************************************
	@api:	Z_CamArray_EV_Set(int ev)
	@func:	设置自动曝光ev值
	@para:	
			int ev:范围[-3:3]			
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_EV_Set(int ev);


/*********************************************
	@api:	Z_CamArray_EV_Get(int camera_id, int* ev)
	@func:	获取自动曝光ev值
	@para:	
			int camera_id：相机编号
			int* ev:范围[-3:3]
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_EV_Get(int camera_id, int* ev);


/*********************************************
	@api:	Z_CamArray_Shutter_Set(int shutter)
	@func:	设置手动曝光快门值
	@para:	
			int shutter: 快门时间 1/shutter 秒
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Shutter_Set(int shutter);


/*********************************************
	@api:	Z_CamArray_Shutter_Get(int camera_id, int* shutter)
	@func:	获取曝光快门值
	@para:	
			int camera_id：相机编号
			int* shutter: 快门时间 1/shutter 秒
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_Shutter_Get(int camera_id, int* shutter);


/*********************************************
	@api:	Z_CamArray_ISO_Set(int iso)
	@func:	设置手动曝光增益值
	@para:	
			int iso: 增益倍数，100：x1、200：x2、400：x4
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_ISO_Set(int iso);


/*********************************************
	@api:	Z_CamArray_ISO_Get(int camera_id, int* iso)
	@func:	获取曝光增益值
	@para:	
			int camera_id：相机编号
			int* iso: 增益倍数，100：x1、200：x2、400：x4
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_ISO_Get(int camera_id, int* iso);


/*********************************************
	@api:	Z_CamArray_AWB_Set(int mode)
	@func:	设置白平衡模式
	@para:	
			int mode:
				1：进行自动同步白平衡（使用相机0作为基准）
				2：进行独立锁定白平衡
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_AWB_Set(int mode);


/*********************************************
	@api:	Z_CamArray_AWB_Status(int* status)
	@func:	获取白平衡状态
	@para:	
			* status:
				0-待机
				1-模式设置处理中
				2-完成模式设置
				3-设置出错
	@return:
			0:成功
			-1:失败
*********************************************/
Z_CAM_ARRAY_SDK_API int Z_CamArray_AWB_Status(int* status);

#ifdef __cplusplus 
}
#endif

#endif
