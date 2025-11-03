using Practice;

A a = new A(5, 3);
Console.WriteLine($"Tong: {a.Tong(a.x, a.y)}");
B b = new B(5, 3);
Console.WriteLine($"Nhan: {b.Nhan(2)}");

A a1 = new B(5, 3) { model = "Hoàng Quí" };
A b1 = new C(5, 3) { model = "Trà Mi" };

a1.inManHinh();
b1.inManHinh();