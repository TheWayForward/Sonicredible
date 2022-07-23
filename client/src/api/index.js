import ajax from "../api/ajax";
import ajax_fileupload from "../api/ajax_fileupload";
import EnumHelper from "../utils/enum_helper";

const BASE_URL = "http://127.0.0.1:3000/api/v1";

export const login = ({username, password}) => ajax({
    url: `${BASE_URL}/user/login`,
    params: {
        username: username,
        password: password
    },
    method: EnumHelper.HTTPMethod.POST
});

export const userFullRegister = ({username, password, realname, nickname, tel, email}) => ajax({
    url: `${BASE_URL}/user/full_register`,
    params: {
        username: username,
        password: password,
        realname: realname,
        nickname: nickname,
        tel: tel,
        email: email,
    },
    method: EnumHelper.HTTPMethod.POST
});

export const userUpdate = ({id, realname, nickname, tel, email, avatar}) => ajax({
    url: `${BASE_URL}/user/update`,
    params: {
        id: id,
        realname: realname,
        nickname: nickname,
        avatar: avatar,
        tel: tel,
        email: email
    },
    method: EnumHelper.HTTPMethod.POST
});

export const getUsers = (page_index) => ajax({
    url: `${BASE_URL}/user/get_users`,
    params: {
        page_index: page_index
    },
    method: EnumHelper.HTTPMethod.POST
});

export const getAudios = (page_index) => ajax({
    url: `${BASE_URL}/audio/get_audios`,
    params: {
        page_index: page_index
    },
    method: EnumHelper.HTTPMethod.POST
});

export const audioRecognitionByAudioId = (audio_id) => ajax({
    url: `${BASE_URL}/audio/recognition`,
    params: {audio_id: audio_id},
    method: EnumHelper.HTTPMethod.POST
});

export const audioInstructionByAudioId = (audio_id) => ajax({
    url: `${BASE_URL}/audio/instruction`,
    params: {audio_id: audio_id},
    method: EnumHelper.HTTPMethod.POST
});

export const getCommands = (page_index) => ajax({
    url: `${BASE_URL}/command/get_commands`,
    params: {
        page_index: page_index
    },
    method: EnumHelper.HTTPMethod.POST
});

export const commandRegister = ({keyword, description, content}) => ajax({
    url: `${BASE_URL}/command/register`,
    params: {
        keyword: keyword,
        description: description,
        content: content
    },
    method: EnumHelper.HTTPMethod.POST
});

export const commandUpdate = () => ajax({
    url: `${BASE_URL}/command/update`,
    params: {

    },
    method: EnumHelper.HTTPMethod.POST
});

export const getVoiceprints = (page_index) => ajax({
    url: `${BASE_URL}/voiceprint/get_voiceprints`,
    params: {
        page_index: page_index
    },
    method: EnumHelper.HTTPMethod.POST
});

export const uploadAvatar = (form) => ajax_fileupload(`${BASE_URL}/upload/avatar`, form);

export const uploadVoiceprint = (form) => ajax_fileupload(`${BASE_URL}/upload/voiceprint`, form);

export const uploadAudioRecognition = (form) => ajax_fileupload(`${BASE_URL}/upload/audio_recognition`, form);


