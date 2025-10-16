
namespace BLL.IService
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(IFormFile file, string folderName);

        // Xóa file cũ
        Task DeleteFileAsync(string fileUrl);
    }
}
