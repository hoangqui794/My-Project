namespace Practice
{
    public class A
    {
        public int x;
        public int y;

        public string model { get; set; }

        public A(int x, int y)
        {
            this.x = x;
            this.y = y;
        }

        public int Tong(int x, int y)
        {
            return x + y;
        }

        public int Hieu(int x, int y)
        {
            return x - y;
        }

        // Đánh dấu phương thức có thể bị ghi đè (override) bằng từ khóa 'virtual'
        public virtual void inManHinh()
        {
            Console.WriteLine("đẹp");
        }
    }
}