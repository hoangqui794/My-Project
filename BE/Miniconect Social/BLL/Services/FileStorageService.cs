namespace BLL.Services
{
    public class FileStorageService : IFileStorageService
    {
        public  Task DeleteFileAsync(string fileUrl)
        {
            return  Task.CompletedTask;
        }

        public async Task<string> SaveFileAsync(IFormFile file, IFormFile folderName)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File không hợp lệ.", nameof(file));
            }
           using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            var fileBytes = ms.ToArray();
            var base64String = Convert.ToBase64String(fileBytes);
            return base64String;
        }
    }
}
