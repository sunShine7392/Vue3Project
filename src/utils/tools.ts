import { ElMessage } from "element-plus";
import type { UploadProps } from "element-plus";

export const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  /*
    rawFile 上传图片文件
      type 图片类型
      size 图片大小
  */
  const validImageTypes = ["image/jpeg", "image/png"];

  if (!validImageTypes.includes(rawFile.type)) {
    ElMessage.error("图片只能是jpg或png格式!");
    // 返回值false，就会中止上传
    return false;
  } else if (rawFile.size > 250 * 1024) {
    ElMessage.error("图片大小不能超过250kb!");
    return false;
  }
  // 返回值true，就会继续上传
  return true;
};
