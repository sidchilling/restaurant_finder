package org.sidgroup.siddharth;

import org.apache.cordova.DroidGap;

import android.os.Bundle;
import android.util.Log;
import android.view.View;

public class MyActivity extends DroidGap {
	
	@Override
	public void onCreate(Bundle bundle) {
		Log.d("MyActivity", "Inside MyActivity");
		super.onCreate(bundle);
		setContentView(R.layout.main);
	}
	
	public void onClick(View view) {
		super.loadUrl("file:///android_asset/www/plugin.html");
	}
	
}
