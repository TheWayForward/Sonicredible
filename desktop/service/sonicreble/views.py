import os
from django.shortcuts import render
import requests as Request
from django.http import HttpResponse, JsonResponse
from sonicreble_sdk.infer_contrast import *
import utils.convert_helper as ConvertHelper
import utils.file_helper as FileHelper
import utils.message_helper as MessageHelper
import utils.response_helper as ResponseHelper


def voiceprint_contrast(request):
    if request.method == "POST":
        data = ConvertHelper.stringToDict(request.body)

        userVoiceprintUrl = data["user_voiceprint_url"]
        targetVoiceUrl = data["target_voice_url"]

        userVoiceprintFileName = FileHelper.getFileName(userVoiceprintUrl)
        targetVoiceFileName = FileHelper.getFileName(targetVoiceUrl)

        try:
            userVoiceprintData = Request.get(userVoiceprintUrl)
            targetVoiceData = Request.get(targetVoiceUrl)

            userVoiceprintDirectory = FileHelper.directory["public"]["voicereco"] + "/" + userVoiceprintFileName
            targetVoiceprintDirectory = FileHelper.directory["public"]["voicereco"] + "/" + targetVoiceFileName

            with open(userVoiceprintDirectory, "wb") as file:
                file.write(userVoiceprintData.content)

            with open(targetVoiceprintDirectory, "wb") as file:
                file.write(targetVoiceData.content)

        except Exception as e:
            print(e)
            return JsonResponse(ResponseHelper.responseERROR())

        try:
            result = contrast(userVoiceprintDirectory, targetVoiceprintDirectory)
        except Exception as e:
            print(e)
            return JsonResponse(ResponseHelper.responseERROR())

        print(result)

        os.remove(userVoiceprintDirectory)
        os.remove(targetVoiceprintDirectory)

        return JsonResponse(ResponseHelper.responseOK(info={
            "is_same": str(result["is_same"]),
            "similarity": str(result["similarity"])
        }))
