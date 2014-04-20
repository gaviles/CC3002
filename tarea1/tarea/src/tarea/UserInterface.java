package tarea;

import java.io.*;

public class UserInterface {

	public static void main(String[] args) throws IOException {
		
		BufferedReader buffer=new BufferedReader(new InputStreamReader(System.in));
		
		System.out.print("\n*********************************************\n");
		System.out.print(  "* Welcome to the console Histogram creator  *\n");
		System.out.print(  "* Write the type of Histogram that you want *\n");
		System.out.print(  "*     Type:             |  Number:          *\n");
		System.out.print(  "*          SparkLine               1        *\n");
		System.out.print(  "*          DotPlot                 2        *\n");
		System.out.print(  "*        SuperDotPlot              3        *\n");
		System.out.print(  "*         StemAndLeaf              4        *\n");
		System.out.print(  "*********************************************\n");
		
		String histogramType =buffer.readLine();
		
		System.out.print("\n Por Favor ingrese los datos\n");
		
		String histogramData = buffer.readLine();
		
		HistogramCollection histogramCollection = new HistogramCollection();
		
		Histogram histogram  = histogramCollection.getHistogram(histogramType,histogramData);
		histogram.print();
	}
}
