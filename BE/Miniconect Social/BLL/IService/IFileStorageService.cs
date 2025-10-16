
namespace BLL.IService
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(IFormFile file, IFormFile folderName);

        // Xóa file cũ
        Task DeleteFileAsync(string fileUrl);
    }
}
