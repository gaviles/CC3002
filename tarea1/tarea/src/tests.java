
public class tests {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		int num = -14;
		
		int min = num - num % 10;
		int max = min + 10;
		if( min > num ){
			max = min;
			min = max - 10;
		}
		
		System.out.println(max);
		System.out.println(min);
	}

}