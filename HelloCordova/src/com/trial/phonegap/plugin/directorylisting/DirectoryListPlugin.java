package com.trial.phonegap.plugin.directorylisting;

import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;
import org.json.JSONArray;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.util.Log;

import com.phonegap.api.Plugin;

public class DirectoryListPlugin extends Plugin {

	public static final String ACTION = "list";

	@Override
	public PluginResult execute(String action, JSONArray data, String callbackId) {
		Log.d("DirectoryListPlugin", "Plugin Called");
		PluginResult result = null;
		if (ACTION.equals(action)) {
			Intent i = new Intent(Intent.ACTION_VIEW);
			i.setClassName(this.ctx.getContext(), "org.sidgroup.siddharth.MyActivity");
			try {
				Log.d("DirectoryListPlugin", "Going to start Activity");
				this.ctx.startActivity(i);
				Log.d("DirectoryListPlugin", "After staring Activity");
			} catch (ActivityNotFoundException activityNotFoundException) {
				Log.d("DirectoryListPlugin", activityNotFoundException.getMessage());
			}
			result = new PluginResult(Status.OK);
		} else {
			result = new PluginResult(Status.INVALID_ACTION);
			Log.d("DirectoryListPlugin", "Invalid Action: " + action + " passed");
		}
		return result;
	}

}
