namespace Practice
{
    public class B : A
    {
        public int c;

        public B(int x, int y) : base(x, y)
        {
        }

        public int Nhan(int c)
        {
            int result = 0;
            result = c * Tong(x, y);
            return result;
        }

        public override void inManHinh()
        {
            Console.WriteLine($"{model} + đẹp trai top 1");
        }
    }
}